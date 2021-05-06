import React, {ChangeEvent, useState} from "react";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormPropsType) {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean | null>(false)

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }
    const addItem = () => {
        const trimmedTitle = title.trim()
        if(trimmedTitle) {
            props.addItem(trimmedTitle)
            setError(false)
        } else {
            setError(true)
        }
        setTitle("")
    }
    const errorMessage = error ? <div className="error-message">Title is required!!!</div> : null
    return (
        <div>
            <div>
                <input
                    className={error ? "error-input" : ""}
                    value={title}
                    onChange={changeTitle}
                />
                <button onClick={addItem}>+</button>
            </div>
            {errorMessage}
        </div>
    );
}