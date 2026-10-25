const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/app/pages/sales/customerDraft.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { exports: {} };
vm.runInNewContext(compiled.outputText, context);
const { getCustomerFormData, isCustomerDetailComplete, isAddressComplete } = context.exports;

const history = { CUSTOMERSTATUS: [{ Contract: {
  CustomerFirstName: 'History name', CustomerLastName: 'History surname', IDCard: '1234567890123',
  Brithday: '1990-01-02', Address: [{ TelMobile: '080-000-0000', AddressDetail: 'Old address' }],
} }] };
const customer = {
  CUSTOMERTYPE: '0', CUSTOMERID: '1234567890123', CUSTOMERNAME: 'Saved name', CUSTOMERLASTNAME: 'Saved surname',
  CUSTOMERMOBILE: '0800000000', CUSTOMERDOB: '1991-03-04',
  CARDTYPE: [{ CARDTYPE: '0' }], PREFIX: [{ PREFIXID: 1 }], SEX: [{ SEXID: 0 }],
};
const address = { ADDRESSNUMBER: '1', ADDRESSPROVINCE: '10', ADDRESSDISTRICT: '1001', ADDRESSSUBDISTRICT: '100101' };

test('history fills a form without completing or mutating the draft, including after re-entry', () => {
  const draft = structuredClone(history);
  const before = JSON.stringify(draft);
  assert.equal(getCustomerFormData(draft).CUSTOMERNAME, 'History name');
  assert.equal(getCustomerFormData(draft).CUSTOMERMOBILE, '0800000000');
  assert.equal(JSON.stringify(draft), before);
  const reopened = JSON.parse(before);
  assert.equal(isCustomerDetailComplete(reopened), false);
  assert.equal(isAddressComplete(reopened), false);
  assert.equal(getCustomerFormData(reopened).CUSTOMERNAME, 'History name');
});

test('saved customer wins over history on re-entry, including intentionally empty optional fields', () => {
  const saved = { ...customer, CUSTOMEREMAIL: '' };
  const draft = { ...history, CUSTOMERDETAIL: [saved] };
  assert.equal(getCustomerFormData(draft), saved);
  assert.equal(isCustomerDetailComplete(draft), true);
});

test('old automatically seeded customer records cannot unlock later steps', () => {
  const draft = { ...history, CUSTOMERDETAIL: [{ CUSTOMERNAME: 'Name', CUSTOMERMOBILE: '0800000000', CUSTOMERTYPE: '' }] };
  assert.equal(isCustomerDetailComplete(draft), false);
});

test('each required personal field blocks completion when missing', () => {
  for (const field of ['CUSTOMERTYPE', 'CUSTOMERID', 'CUSTOMERNAME', 'CUSTOMERLASTNAME', 'CUSTOMERMOBILE', 'CUSTOMERDOB', 'CARDTYPE', 'PREFIX', 'SEX']) {
    const saved = { ...customer };
    delete saved[field];
    assert.equal(isCustomerDetailComplete({ CUSTOMERDETAIL: [saved] }), false, field);
  }
});

test('company customers do not require personal birth, sex, surname or card type', () => {
  assert.equal(isCustomerDetailComplete({ CUSTOMERDETAIL: [{
    CUSTOMERTYPE: '1', CUSTOMERID: '1234567890123', CUSTOMERNAME: 'Company', CUSTOMERMOBILE: '0800000000', PREFIX: [{ PREFIXID: 2 }],
  }] }), true);
});

test('a province alone and a missing installation or payment address cannot unlock later steps', () => {
  assert.equal(isAddressComplete({ ADDRESS: [{ ADDRESSCARD: { ADDRESSPROVINCENAME: 'Province' } }] }), false);
  for (const section of ['ADDRESSCARD', 'ADDRESSINSTALLATION', 'ADDRESSPAYMENT']) {
    const saved = { ADDRESSCARD: address, ADDRESSINSTALLATION: address, ADDRESSPAYMENT: address };
    delete saved[section];
    assert.equal(isAddressComplete({ ADDRESS: [saved] }), false, section);
  }
});

test('all saved addresses complete the step, with tax address required only when selected', () => {
  const saved = { ADDRESSCARD: address, ADDRESSINSTALLATION: address, ADDRESSPAYMENT: address };
  assert.equal(isAddressComplete({ ADDRESS: [saved] }), true);
  assert.equal(isAddressComplete({ ADDRESS: [{ ...saved, ADDRESSTAX: { USETHISTAX: 'TRUE' } }] }), false);
  assert.equal(isAddressComplete({ ADDRESS: [{ ...saved, ADDRESSTAX: { ...address, USETHISTAX: 'TRUE' } }] }), true);
});

test('search-only drafts seed the correct field and remain incomplete', () => {
  for (const [search, field] of [['1234567890123', 'CUSTOMERID'], ['0800000000', 'CUSTOMERMOBILE'], ['New customer', 'CUSTOMERNAME']]) {
    const draft = { CUSTOMERSTATUS: [{ Searchtext: search }] };
    assert.equal(getCustomerFormData(draft)[field], search);
    assert.equal(isCustomerDetailComplete(draft), false);
  }
});
