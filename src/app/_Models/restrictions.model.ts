export class Restrictions {
    
    public show_locations:boolean;
    public show_agents:boolean;
    public show_services:boolean;
    public show_service_categories:boolean;
    public selected_location:boolean;
    public selected_agent:boolean;
    public selected_service:boolean;
    public selected_service_category:boolean;
    public calendar_start_date:boolean;
   
    constructor(
        show_locations:boolean,
        show_agents:boolean,
        show_services:boolean,
        show_service_categories:boolean,
        selected_location:boolean,
        selected_agent:boolean,
        selected_service:boolean,
        selected_service_category:boolean,
        calendar_start_date:boolean
     ){
        this.show_locations = show_locations;
        this.show_agents = show_agents;
        this.show_services = show_services;
        this.show_service_categories = show_service_categories;
        this.selected_location = selected_location;
        this.selected_agent = selected_agent;
        this.selected_service = selected_service;
        this.selected_service_category = selected_service_category;
        this.calendar_start_date = calendar_start_date;
    }
}
