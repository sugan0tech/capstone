import {useTranslation} from "react-i18next";
import {GlobeSvg} from "../assets/GlobeSvg.tsx";

const languages = [
    {code: 'en', lang: "English"},
    {code: 'fn', lang: "French"},
    {code: 'ta', lang: "Tamil"},
    {code: 'hi', lang: "Hindi"}
]

function LanguaguSelector() {
    const {i18n} = useTranslation()

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then;
    }
    return (
        <>
            <div className="relative">
                <div className="indicator">
                    <span className="indicator-item indicator-bottom indicator-right badge badge-primary">
                        {i18n.language}
                    </span>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn m-1">
                            <GlobeSvg/>
                        </div>
                        <ul tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            {languages.map((lng) => {
                                return <div className={lng.code === i18n.language ? "btn selected" : "btn"}
                                            key={lng.code} onClick={() => changeLanguage(lng.code)}>{lng.lang}</div>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LanguaguSelector;