import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import SignIn from "./pages/SignIn.vue";
import SignUp from "./pages/SignUp.vue";
import About from "./pages/About.vue";
import Accounts from "./pages/Accounts.vue";
import Rides from "./pages/Rides.vue";
import Driver from "./pages/Driver.vue";
import createRide from "./pages/CreateRide.vue";
import createVehicle from "./pages/CreateVehicle.vue";
import Vehicles from "./pages/Vehicles.vue";
import Locations from "./pages/Locations.vue";
import CreateLocation from "./pages/CreateLocation.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "sign-up", path: "/sign-up", component: SignUp },
    { name: "sign-in", path: "/sign-in", component: SignIn },
    { name: "about-us", path: "/about-us", component: About },
    { name: "accounts", path: "/accounts", component: Accounts },
    { name: "rides", path: "/rides", component: Rides },
    { name: "driver", path: "/driver", component: Driver},
    { name: "createRide", path: "/createRide", component: createRide},
    { name: "createVehicle", path: "/createVehicle", component: createVehicle},
    { name: "vehicles", path: "/vehicles", component: Vehicles },
    { name: "locations", path: "/locations", component: Locations },
    { name: "createLocation", path: "/createLocation", component: CreateLocation},
  ]
});
