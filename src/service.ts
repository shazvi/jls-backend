import {CoreProduct, FullProduct, FullProductRow} from './interface';
import {db} from './db';

export const getProducts = async (): Promise<CoreProduct[]> => {
    const queryString = "select core_id, internal_title from core_product";

    // Wrap db query callback in Promise
    return new Promise<CoreProduct[]>((resolve, reject) => {
        db.query(queryString, (err, result: CoreProduct[]) => {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

export const getProductById = async (coreId: string): Promise<FullProduct | null> => {
    // Get core product + stock data for core product
    const queryString = 
        `select c.core_id, c.internal_title, c.vendor, c.vendor_title, c.vendor_sku, c.backup_vendor, c.backup_vendor_sku, c.restockable, c.vendor_order_unit, c.vendor_case_pack, c.moq, c.buffer_days, c.minimum_level, c.product_url, c.note_for_next_order, c.case_pack, c.pieces_per_internal_box, c.boxes_per_case, c.tags_info, c.tag1, c.tag2, c.tag3, c.tag4, c.hazmat, c.active, c.ignore_until, c.notes, s.location, s.quantity
        from core_product as c
        left join stock s on c.core_id = s.core_id
        where c.core_id = ?`;

    // Wrap db query callback in Promise
    return new Promise<FullProduct | null>((resolve, reject) => {
        db.query(queryString, coreId, (err, result: FullProductRow[]) => {
            if(err) {
                reject(err);
            } else {
                if(result.length < 1) {
                    return resolve(null);
                }
                
                // assign db query object properties to response object, append stock data
                const fullProduct: FullProduct = {
                    ...result[0],
                    stock: []
                };
                result.forEach((row) => {
                    if (row.location && row.quantity) {
                        fullProduct.stock.push({
                            location: row.location,
                            quantity: row.quantity
                        });
                    }
                });
                resolve(fullProduct);
            }
        });
    });
};

export const updateProductById = async (core_id: string, location: string, quantityChange: string): Promise<boolean> => {
    const queryString = "update stock set quantity = quantity + ? where core_id = ? and location = ?";

    // Wrap db query callback in Promise
    return new Promise<boolean>((resolve, reject) => {
        db.query(queryString, [quantityChange, core_id, location], (err, results) => {
            if(err) {
                reject(err);
            } else {
                // return UPDATE success/failure as bool
                resolve(results.affectedRows === 1);
            }
        });
    });
};

export const createTransaction = async (core_id: string, location: string, quantityChange: string): Promise<boolean> => {
    const queryString = "INSERT INTO transaction(core_id, location, quantity_change) VALUES (?,?,?)";

    // Wrap db query callback in Promise
    return new Promise<boolean>((resolve, reject) => {
        db.query(queryString, [core_id, location, quantityChange], (err, results) => {
            if(err) {
                reject(err);
            } else {
                // return INSERT success/failure as bool
                resolve(results.affectedRows === 1);
            }
        });
    });
};
