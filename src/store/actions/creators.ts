export function createActionPayload<TypeAction, TypePayload>(
    actionType: TypeAction,
): (payload: TypePayload) => IActionsWithPayload<TypeAction, TypePayload> {
    return (p: TypePayload): IActionsWithPayload<TypeAction, TypePayload> => {
        return {
            payload: p,
            type: actionType,
        };
    };
}
export function createAction<TypeAction>(
    actionType: TypeAction,
): () => IActionsWithoutPayload<TypeAction> {
    return (): IActionsWithoutPayload<TypeAction> => {
        return {
            type: actionType,
        };
    };
}

export interface IActionsWithPayload<TypeAction, TypePayload> {
    type: TypeAction;
    payload: TypePayload;
}

export interface IActionsWithoutPayload<TypeAction> {
    type: TypeAction;
}
