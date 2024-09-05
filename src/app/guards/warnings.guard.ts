import { CanDeactivateFn } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';

export const warningsGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  const currentComponent = component as LoginComponent;;
  if(currentComponent.form.invalid && currentComponent.form.dirty){
    return window.confirm('¿Deseas descartar los cambios?');
  }
  return true;
};