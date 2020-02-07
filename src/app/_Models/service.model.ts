export class Service {

    public bg_color:string;
    public buffer_after: string;
    public buffer_before: string;
    public category_id: string;
    public charge_amount: string;
    public color: string;
    public created_at: string;
    public deposit_amount: string;
    public deposit_value: any;
    public description_image_id: string;
    public duration: string;
    public id: string;
    public is_custom_duration: Boolean;
    public is_custom_hours: Boolean;
    public is_custom_price: Boolean;
    public is_deposit_required: any;
    public is_price_variable: any;
    public last_query: string;
    public meta: Boolean;
    public name: string;
    public nice_names:any[];
    public order_number: any;
    public price_max: string;
    public price_min: string;
    public selection_image_id: string;
    public services_agents_table_name: string;
    public short_description: string;
    public status: string;
    public table_name: string;
    public timeblock_interval: string;
    public updated_at: string;
    public thumbnail_url:string
    
    constructor(
        bg_color:string,
        buffer_after: string,
        buffer_before: string,
        category_id: string,
        charge_amount: string,
        color: string,
        created_at: string,
        deposit_amount: string,
        deposit_value: any,
        description_image_id: string,
        duration: string,
        id: string,
        is_custom_duration: Boolean,
        is_custom_hours: Boolean,
        is_custom_price: Boolean,
        is_deposit_required: any,
        is_price_variable: any,
        last_query: string,
        meta: Boolean,
        name: string,
        nice_names:any[],
        order_number: any,
        price_max: string,
        price_min: string,
        selection_image_id: string,
        services_agents_table_name: string,
        short_description: string,
        status: string,
        table_name: string,
        timeblock_interval: string,
        updated_at: string,
        thumbnail_url:string
     ){

        this.bg_color = bg_color;
        this.buffer_after = buffer_after;
        this.buffer_before = buffer_before;
        this.category_id = category_id;
        this.charge_amount = charge_amount;
        this.color = color;
        this.created_at = created_at;
        this.deposit_amount = deposit_amount;
        this.deposit_value = deposit_value;
        this.description_image_id = description_image_id;
        this.duration = duration;
        this.id = id;
        this.is_custom_duration = is_custom_duration;
        this.is_custom_hours = is_custom_hours;
        this.is_custom_price = is_custom_price;
        this.is_deposit_required = is_deposit_required;
        this.is_price_variable = is_price_variable;
        this.last_query = last_query;
        this.meta = meta;
        this.name = name
        this.nice_names = nice_names;
        this.order_number = order_number;
        this.price_max = price_max;
        this.price_min = price_min;
        this.selection_image_id = selection_image_id;
        this.services_agents_table_name = services_agents_table_name;
        this.short_description = short_description;
        this.status = status;
        this.table_name = table_name;
        this.timeblock_interval = timeblock_interval;
        this.updated_at = updated_at;
        this.thumbnail_url = thumbnail_url;
    }
}