import {CoreProduct, FullProduct, FullProductRow, Stock} from './interface';
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
        `select
            c.core_id, c.internal_title, c.vendor, c.vendor_title, c.vendor_sku, c.backup_vendor, c.backup_vendor_sku, c.restockable, c.vendor_order_unit, c.vendor_case_pack, c.moq, c.buffer_days, c.minimum_level, c.product_url, c.note_for_next_order, c.case_pack, c.pieces_per_internal_box, c.boxes_per_case, c.tags_info, c.tag1, c.tag2, c.tag3, c.tag4, c.hazmat, c.active, c.ignore_until, c.notes,
            s.location, s.quantity,
            t.id as transaction_id, t.quantity_change, t.date_time
        from core_product as c
        left join stock s on c.core_id = s.core_id
        left join transaction t on c.core_id = t.core_id and s.location = t.location
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

                const locationChecked: string[] = [];
                const stock: Stock[] = [];
                let total_quantity = 0;
                
                result.forEach((row) => {
                    const {location, quantity, transaction_id, quantity_change, date_time} = row;

                    // stock data for each location
                    if (location && quantity && !locationChecked.includes(location)) {
                        stock.push({
                            location: location,
                            quantity: quantity,
                            transactions: []
                        });
                        total_quantity += quantity;
                        locationChecked.push(location);
                    }

                    // append transaction data to last added location (to keep this logic within a single loop)
                    if (transaction_id && location && quantity_change && date_time) {
                        stock[stock.length-1].transactions.push({
                            id: transaction_id,
                            core_id: coreId,
                            location,
                            quantity_change,
                            date_time
                        });
                    }
                });

                // assign db query result properties to response object,
                const fullProductRow = result[0];
                delete fullProductRow.location;
                delete fullProductRow.quantity;
                delete fullProductRow.transaction_id;
                delete fullProductRow.quantity_change;
                delete fullProductRow.date_time;
                const fullProduct: FullProduct = {...fullProductRow, total_quantity, stock};
                
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
