import { CanDeactivateFn } from '@angular/router';
import { CanExit } from '../interfaces/CanExit.interface';

export const onExitGuard: CanDeactivateFn<CanExit> = (component, currentRoute, currentState, nextState) => {
  return component.onExit ? component.onExit() : true;
};
