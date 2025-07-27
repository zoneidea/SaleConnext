import React from 'react'

type Props = {
    initialProduct: any[]
}

const SummaryStockOnlyMe: React.FC<Props> = ({ initialProduct }) => {
    // รวมจำนวนสินค้าตาม ItemDescription
    const groupedProducts = initialProduct.reduce((acc: Record<string, { description: string, count: number }>, curr) => {
        const key = curr.ItemDescription?.trim() ?? 'ไม่ระบุ';
        if (!acc[key]) {
            acc[key] = { description: key, count: 1 };
        } else {
            acc[key].count += 1;
        }
        return acc;
    }, {});

    const productList = Object.values(groupedProducts);

    // คำนวณยอดรวมทั้งหมด
    const totalCount = productList.reduce((sum, p) => sum + p.count, 0);

    return (
        <div className="card">
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bold fs-3 mb-1">สินค้าในคลัง</span>
                </h3>
            </div>
            <div className="card-body py-3">
                <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                        <thead>
                            <tr className="fw-bold text-muted">
                                <th className="min-w-150px">สินค้า</th>
                                <th className="min-w-140px">จำนวน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productList.length > 0 ? (
                                productList.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-gray-900 fw-bold">
                                            {item.description}
                                        </td>
                                        <td className="fw-semibold fs-6">
                                            {item.count}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center text-muted">ไม่มีสินค้าในคลัง</td>
                                </tr>
                            )}

                            {/* แถวรวมยอดทั้งหมด */}
                            {productList.length > 0 && (
                                <tr className="border-top">
                                    <td className="fw-bold text-muted">รวม</td>
                                    <td className="fw-bold">{totalCount}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export { SummaryStockOnlyMe };