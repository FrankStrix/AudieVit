import { Routes } from "@angular/router";
import { VoiceAssistantComponent } from "./components/voice-assistant/voice-assistant.component";

export const routes: Routes = [
  {
    path: "voice",
    component: VoiceAssistantComponent
  },
  {
    path: "",
    redirectTo: "voice",
    pathMatch: "full"
  }
];
