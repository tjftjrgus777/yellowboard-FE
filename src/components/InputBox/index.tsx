import { Dispatch, SetStateAction, KeyboardEvent, forwardRef, ChangeEvent } from "react";
import './style.css'

interface Props {
    label: string;
    placeholder: string;
    type: 'text' | 'password';
    value: string;
    isErrorMessage?: boolean;
    buttonTitle?:string;
    message?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
    
    error: boolean;
    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';


}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    const { label, placeholder, type, error, value, isErrorMessage, buttonTitle, message, icon } = props;
    const { onChange, onButtonClick, onKeyDown } = props;

    const buttonClass = value === '' ? 'input-box-button-disable' : 'input-box-button'
    const messageClass = isErrorMessage ? 'input-box-message-error' : 'input-box-message'



    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!onKeyDown) return;
        onKeyDown(event);
    }

    return (
        <div className='inputbox'>
            <div className='input-box-title'>{label}</div>
            <div className={error ? 'input-box-content-error' : 'input-box-content'}>
                <div className="input-box-body">
                    <input ref={ref} type={type} className='input-box-input' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown} />
                    {buttonTitle !== undefined && onButtonClick !== undefined && <div className={buttonClass} onClick={onButtonClick}>{buttonTitle}</div> }
                </div>
                {message !== undefined && <div className={messageClass}>{message}</div> }
                {
                    onButtonClick !== undefined && (
                        <div className='icon-button' onClick={onButtonClick}>
                            {icon !== undefined && (<div className={`icon ${icon}`}></div>)}
                        </div>
                    )
                }
            </div>
            
            
        

        </div>
    );
});

export default InputBox;

