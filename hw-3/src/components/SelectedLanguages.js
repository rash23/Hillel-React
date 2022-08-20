import {memo, } from "react";

const languages = ["All", "Javascript", "Python", "Java", "Ruby", "Scala"]
const SelectedLanguages = memo((props) => {

    return <ul className="languages">
        {languages.map((language, index) => {

            return <li key={index}
                       className={language === props.selectedLanguage || language.toLowerCase() === props.queryParams  ? "selected" : null}
                       onClick={() => {
                           props.setSearchParams({language: language.toLowerCase()})
                           props.selectedLanguageHandler(language)
                       }
                       }>{language}
            </li>
        })}
    </ul>
}, (prevProps, nextProps) => {
    return prevProps.selectedLanguage === nextProps.selectedLanguage;
})
export default SelectedLanguages;
