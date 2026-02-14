
export const is_dev = (process.env.NODE_ENV == "development")
export const is_prod = !is_dev