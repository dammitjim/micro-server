export interface ICreateTaskRequestBody {
    title: string;
    text: string;
    completed: boolean;
}

export interface IUpdateTaskRequestBody extends ICreateTaskRequestBody {
    id: number;
}
