export type upsertCountryLog = {
    id: number,
    user_id: number,
    country_name: string,
    visa_type: string,
    entry_date: Date,
    exit_date: Date,
    visa_limit_days: number,
    notify_at: Date,
}

export type countryLog = {
    id: number;
    user_id: number;
    country_name: string;
    visa_type: string;
    entry_date: Date;
    exit_date: Date;
    visa_limit_days: number;
    notify_at: Date;
    created_at: Date;
}