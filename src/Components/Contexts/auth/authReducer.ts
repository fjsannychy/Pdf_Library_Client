import type { State, Actions } from './types';
import { CommonService } from '../../../Services/commonServices.ts';


export function authReducer(state: State, action: Actions): State {


  switch (action.type) {
    case "Refresh":
      return {
        accessToken: CommonService.GetSessionValByKey("accessToken") ? CommonService.GetSessionValByKey("accessToken") : null,
        username: CommonService.GetSessionValByKey("userName") ? CommonService.GetSessionValByKey("username") : null
      } as State;
    case "LoginSuccess":
      return {
        accessToken: action.data.accessToken,
        username: action.data.username
      } as State;
    case "Logout":
      return {
        accessToken: null,
        username: null
      } as State;
    default:
      return {
        accessToken: CommonService.GetSessionValByKey("accessToken") ? CommonService.GetSessionValByKey("accessToken") : null,
        username: CommonService.GetSessionValByKey("username") ? CommonService.GetSessionValByKey("username") : null
      } as State

  };
}