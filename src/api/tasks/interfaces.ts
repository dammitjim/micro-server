export interface CreateTaskRequestBody {
    title: string;
    text: string;
    completed: boolean;
}

export interface UpdateTaskRequestBody extends CreateTaskRequestBody {
    id: number;
}
