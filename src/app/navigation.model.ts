export class Navigation {

    public navigation_id : number;
    public route: string;
    public state : any;

    constructor(navigation_id:number, route:string, state:any){
        this.navigation_id = navigation_id;
        this.route = route;
        this.state = state;
    }

}