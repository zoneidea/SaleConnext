import axios from "axios";
import Swal from "sweetalert2";

const asAmount = (value: unknown): number => {
  if (value == null || (Array.isArray(value) && value.length === 0)) return 0;
  if (typeof value !== "number" && typeof value !== "string") return NaN;
  return Number(value);
};

export function getDiscountError(amount: unknown, maximum: unknown): string | null {
  const discount = asAmount(amount);
  const limit = asAmount(maximum);
  if (!Number.isFinite(discount) || discount < 0 || !Number.isFinite(limit) || limit < 0) {
    return "ข้อมูลส่วนลดไม่ถูกต้อง กรุณาตรวจสอบส่วนลดและแพ็กเกจอีกครั้ง";
  }
  return discount > limit
    ? `ส่วนลดต้องไม่เกิน ${limit.toLocaleString("th-TH")} บาท กรุณากลับไปแก้ไขส่วนลดก่อนบันทึกสัญญา`
    : null;
}

// Read the persisted JSON at save time; navigation state can contain an older package.
export async function validateLatestContractDiscount(apiUrl: string, refno: string): Promise<boolean> {
  const response = await axios.get(`${apiUrl}/Contract/GetContractSummary`, { params: { refno } });
  const records = response.data?.data;
  const contract = Array.isArray(records) ? records.find(record => record.REFNO === refno) : undefined;
  const pkg = contract?.PRODUCT?.[0]?.Package?.[0];
  if (!refno || !pkg) throw new Error("Cannot verify the latest contract package");
  const error = getDiscountError(contract?.DISCOUNT?.[0]?.DISCOUNTAMOUNT, pkg.DISCOUNTPRICE);
  if (error) {
    await Swal.fire({ icon: "error", title: "ไม่สามารถบันทึกสัญญาได้", text: error, confirmButtonText: "ตกลง" });
    return false;
  }
  return true;
}
