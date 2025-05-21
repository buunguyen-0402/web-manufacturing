import cl from "classnames"

function Card({ children, onCLick, className, ...props }) {
    return (
        <div data-component="Card" className={cl("rounded-xl shadow-type1", className)} onClick={onCLick} {...props}>
            {children}
        </div>
    )
}

export default Card
