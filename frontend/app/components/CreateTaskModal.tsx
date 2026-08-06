import {
    X,
    UploadCloud,
    User,
} from "lucide-react";

export default function CreateTaskModal() {
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="flex justify-center p-10 h-100 w-full max-w-4xl rounded-md bg-white shadow-2xl">

                <div className="space-y-5 p-6  text-black">

                    <div className="grid grid-cols-5 items-start gap-4">
                        <label className="text-lg text-gray-900">Nome da tarefa</label>

                        <div className="col-span-4 rounded border p-2">
                            <div className="flex flex-wrap gap-2">


                                <input
                                    placeholder="Escreva o nome da terefa aqui..."
                                    className="flex-1 min-w-55 border-none outline-none"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-5 items-start gap-4">
                        <label className="text-lg text-gray-900">Descrição</label>

                        <div className="col-span-4 rounded border p-2">
                            <div className="flex flex-wrap gap-2">


                                <textarea

                                    placeholder="Escreva A descrição da tarefa aqui..."
                                    className="flex-1 min-w-55 border-none outline-none"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-5 items-center gap-4">
                        <label className="text-lg text-gray-900">
                            Duração
                        </label>

                        <input
                            type="datetime-local"
                            placeholder="Insira a data limite da tarefa"
                            className="col-span-4 rounded border p-2"
                        />
                    </div>


                    <div className="grid grid-cols-6 gap-4">

                        <div className=" col-span-4">

                            <div className="flex items-end  justify-end ">
                                <div className=" space-x-2">

                                    <button className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
                                        Save
                                    </button>

                                    <button className="rounded border px-4 py-2 hover:bg-gray-100">
                                        Cancel
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}