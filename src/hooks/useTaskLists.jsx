import { get, getDatabase, orderByKey, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import '../firebase';

function useTaskLists() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [taskTodo, setTaskTodo] = useState([]);
    const [taskInprogress, setTaskInprogress] = useState([]);
    const [taskDone, setTaskDone] = useState([]);

    useEffect(() => {
        async function fetchTaskLists() {
            // database related works
            const db = getDatabase();
            const taskRef1 = ref(db, 'todos'); // (db,node name)
            const taskRef2 = ref(db, 'inprogress'); // (db,node name)
            const taskRef3 = ref(db, 'done'); // (db,node name)
            const tasksQuery1 = query(taskRef1, orderByKey());
            const tasksQuery2 = query(taskRef2, orderByKey());
            const tasksQuery3 = query(taskRef3, orderByKey());

            try {
                setLoading(true);
                setError(false);
                // request firebase database
                const snapeshot1 = await get(tasksQuery1);
                const snapeshot2 = await get(tasksQuery2);
                const snapeshot3 = await get(tasksQuery3);
                setLoading(false);
                if (snapeshot1.exists()) {
                    setTaskTodo((prevtasks) => [...prevtasks, ...Object.values(snapeshot1.val())]);
                }
                if (snapeshot2.exists()) {
                    setTaskInprogress((prevtasks) => [
                        ...prevtasks,
                        ...Object.values(snapeshot2.val()),
                    ]);
                }
                if (snapeshot3.exists()) {
                    setTaskDone((prevtasks) => [...prevtasks, ...Object.values(snapeshot3.val())]);
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
                setError(true);
            }
        }

        fetchTaskLists();
    }, []);

    return {
        loading,
        error,
        taskTodo,
        taskInprogress,
        taskDone,
    };
}

export default useTaskLists;
