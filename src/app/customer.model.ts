export class Customer {
    
        public activation_key: any;
        public admin_notes: any;
        public avatar_image_id: any;
        public created_at: any;
        public email: any;
        public facebook_user_id: any;
        public first_name: any;
        public google_user_id: any;
        public id: any;
        public is_guest: any;
        public last_name: any;
        public last_query: string;
        public meta: Boolean;
        public nice_names: {};
        public notes: string;
        public password: any;
        public phone: any;
        public status: any;
        public table_name: string;
        public updated_at: any;
        public account_nonse: any;
        
    constructor(
        activation_key: any,
        admin_notes: any,
        avatar_image_id: any,
        created_at: any,
        email: any,
        facebook_user_id: any,
        first_name: any,
        google_user_id: any,
        id: any,
        is_guest: any,
        last_name: any,
        last_query: string,
        meta: Boolean,
        nice_names: {},
        notes: string,
        password: any,
        phone: any,
        status: any,
        table_name: string,
        updated_at: any,
        account_nonse: any,
     ){
        this.activation_key = activation_key;
        this.admin_notes = admin_notes;
        this.avatar_image_id = avatar_image_id;
        this.created_at = created_at;
        this.email = email;
        this.facebook_user_id = facebook_user_id;
        this.first_name = first_name;
        this.google_user_id = google_user_id;
        this.id = id;
        this.is_guest = is_guest;
        this.last_name = last_name;
        this.last_query = last_query;
        this.meta = meta;
        this.nice_names = nice_names;
        this.notes = notes;
        this.password = password;
        this.phone = phone;
        this.status = status;
        this.table_name = table_name;
        this.updated_at = updated_at;
        this.account_nonse = account_nonse;
    }
}