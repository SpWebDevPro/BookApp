export class Agent {

    public created_at: any;
    public description: string;
    public icon_image_id: any;
    public id: string;
    public last_query: string;
    public meta: Boolean;
    public name: string;
    public nice_names: any[];
    public order_number: number;
    public sub_title: string;
    public table_name: string;
    public title: string;
    public updated_at: any;
    public use_custom_image: string;

    constructor(
        created_at: any,
        description: string,
        icon_image_id: any,
        id: string,
        last_query: string,
        meta: Boolean,
        name: string,
        nice_names: any[],
        order_number: number,
        sub_title: string,
        table_name: string,
        title: string,
        updated_at: any,
        use_custom_image: string
    ){
        this.created_at = created_at;
        this.description = description;
        this.icon_image_id = icon_image_id;
        this.id = id;
        this.last_query = last_query;
        this.meta = meta;
        this.name = name;
        this.nice_names = nice_names;
        this.order_number = order_number;
        this.sub_title = sub_title;
        this.table_name = table_name;
        this.title = title;
        this.updated_at = updated_at;
        this.use_custom_image = use_custom_image;
    }

}