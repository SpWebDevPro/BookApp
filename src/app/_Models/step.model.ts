export class Step {
    
    public id:string;
    public name:string;
    public order_number:number;
    public icon_image_id:string;
    public title:string;
    public sub_title:string;
    public use_custom_image:string;
    public updated_at:any;
    public created_at:any;
    public description:string;
    public nice_names:any[];
    public last_query:string;
    public meta:boolean;
    public table_name:string;


    constructor(
        id:string,
        name:string,
        order_number:number,
        icon_image_id:string,
        title:string,
        sub_title:string,
        use_custom_image:string,
        updated_at:any,
        created_at:any,
        description:string,
        nice_names:any[],
        last_query:string,
        meta:boolean,
        table_name:string,
     ){
        this.id = id;
        this.name = name;
        this.order_number = order_number;
        this.icon_image_id = icon_image_id;
        this.title = title;
        this.sub_title = sub_title;
        this.use_custom_image = use_custom_image;
        this.updated_at = updated_at;
        this.created_at = created_at;
        this.description = description;
        this.nice_names = nice_names;
        this.last_query = last_query;
        this.meta = meta;
        this.table_name = table_name;
    }
}