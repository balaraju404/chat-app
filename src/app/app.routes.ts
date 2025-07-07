import { Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
 { path: "", redirectTo: "", pathMatch: "full" },
 { path: "", loadChildren: () => import("./login-container/login-container.routes").then(m => m.lcRoutes) },
 { path: "layout", loadChildren: () => import("./layout/layout.routes").then(m => m.layoutRoutes), canActivate: [AuthGuard] }
]
