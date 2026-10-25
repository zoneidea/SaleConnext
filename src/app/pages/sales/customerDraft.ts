const hasValue = (value: unknown) => value != null && String(value).trim() !== '';

export const cleanAddressName = (value: unknown) => String(value ?? '')
  .replace(/^(?:จ\.|จังหวัด|อ\.|ต\.|เขต|แขวง)\s*/, '').trim();

// History is only a form seed. Never persist this result until the form is validated.
export function getCustomerFormData(contract: any): any {
  const saved = contract?.CUSTOMERDETAIL?.[0];
  if (saved && Object.keys(saved).length > 0) return saved;
  const history = contract?.CUSTOMERSTATUS?.[0];
  const customer = history?.Contract ?? {};
  const address = customer.Address?.[0] ?? {};
  const search = String(history?.Searchtext ?? '').trim();
  return {
    CUSTOMERID: customer.IDCard ?? (/^\d{13}$/.test(search) ? search : ''),
    CUSTOMERNAME: customer.CustomerFirstName ?? (!/^\d+$/.test(search) ? search : ''),
    CUSTOMERLASTNAME: customer.CustomerLastName ?? '',
    CUSTOMERDOB: customer.Brithday ?? '',
    CUSTOMERMOBILE: String(address.TelMobile ?? (/^\d{9,10}$/.test(search) ? search : '')).replace(/-/g, ''),
    CUSTOMERPHONE: String(address.TelHome ?? '').replace(/-/g, ''),
    CUSTOMERWORKPHONE: String(address.TelOffice ?? '').replace(/-/g, ''),
    CUSTOMEREMAIL: address.EMail ?? '',
  };
}

// Check required fields as well as persistence, including drafts created by the old history flow.
export function isCustomerDetailComplete(contract: any): boolean {
  const cd = contract?.CUSTOMERDETAIL?.[0];
  if (!cd || !hasValue(cd.CUSTOMERTYPE) || !hasValue(cd.CUSTOMERNAME) || !hasValue(cd.CUSTOMERMOBILE)) return false;
  const type = String(cd.CUSTOMERTYPE);
  if (type !== '1' && !hasValue(cd.CUSTOMERLASTNAME)) return false;
  if (['0', '1', '2', '3'].includes(type) && !hasValue(cd.PREFIX?.[0]?.PREFIXID)) return false;
  if (['0', '1'].includes(type) && !hasValue(cd.CUSTOMERID)) return false;
  if (['0', '2'].includes(type)) {
    return hasValue(cd.CARDTYPE?.[0]?.CARDTYPE) && hasValue(cd.SEX?.[0]?.SEXID)
      && hasValue(cd.CUSTOMERDOB) && !Number.isNaN(Date.parse(cd.CUSTOMERDOB));
  }
  return true;
}

export function isAddressComplete(contract: any): boolean {
  const saved = contract?.ADDRESS?.[0];
  const complete = (address: any) => ['ADDRESSNUMBER', 'ADDRESSPROVINCE', 'ADDRESSDISTRICT', 'ADDRESSSUBDISTRICT']
    .every(key => hasValue(address?.[key]));
  return !!saved && complete(saved.ADDRESSCARD) && complete(saved.ADDRESSINSTALLATION)
    && complete(saved.ADDRESSPAYMENT)
    && (saved.ADDRESSTAX?.USETHISTAX !== 'TRUE' || complete(saved.ADDRESSTAX));
}
