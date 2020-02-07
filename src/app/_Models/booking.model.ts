export class Booking {
    
    public id:any;
    public service_id:any;
    public customer_id:boolean;
    public agent_id:string;
    public location_id:string;
    public buffer_before:any;
    public buffer_after:any;
    public status:any;
    public start_date:any;
    public end_date:any;
    public start_time:any;
    public end_time:any;
    public payment_method:string;
    public payment_portion:string;
    public payment_token:string;
    public coupon_code:string;
    public duration:any;
    public price:any;
    public customer_comment:string;
    public updated_at:any;
    public created_at:any;
    public nice_names:{};
    public last_query:string;
    public meta:boolean;
    public table_name:string;

   
    constructor(
        id:any,
        service_id:any,
        customer_id:any,
        agent_id:string,
        location_id:string,
        buffer_before:any,
        buffer_after:any,
        status:any,
        start_date:any,
        end_date:any,
        start_time:any,
        end_time:any,
        payment_method:string,
        payment_portion:string,
        payment_token:string,
        coupon_code:string,
        duration:any,
        price:any,
        customer_comment:string,
        updated_at:any,
        created_at:any,
        nice_names:{},
        last_query:string,
        meta:boolean,
        table_name:string,
     ){
        this.id = id;
        this.service_id = service_id;
        this.customer_id = customer_id;
        this.agent_id = agent_id;
        this.location_id = location_id;
        this.buffer_before = buffer_before;
        this.buffer_after = buffer_after;
        this.status = status;
        this.start_date = start_date;
        this.end_date = end_date;
        this.start_time = start_time;
        this.end_time = end_time;
        this.payment_method = payment_method;
        this.payment_portion = payment_portion;
        this.payment_token = payment_token;
        this.coupon_code = coupon_code;
        this.duration = duration;
        this.price = price;
        this.customer_comment = customer_comment;
        this.updated_at = updated_at;
        this.created_at = created_at;
        this.nice_names = nice_names;
        this.last_query = last_query;
        this.meta = meta;
        this.table_name = table_name;
    }
}