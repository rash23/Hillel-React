import {useState, useEffect} from "react";
import {fetchPopularRepos} from "../utils/api";
import SelectedLanguages from "./SelectedLanguages";
import Repos from "./Repos";
import Loader from "./Loader";
import {useSearchParams} from "react-router-dom"
import useDebounce from "../hooks/useDebounce";

const Popular = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParams = searchParams.get("language") || "all"

    const [selectedLanguage, setSelectedLanguage] = useState(queryParams)
    const [repos, setRepos] = useState([])

    const [isSearching, setIsSearching] = useState(false);

    const debouncedValue = useDebounce(selectedLanguage, 1000);

    useEffect(
        () => {
            if (debouncedValue && debouncedValue.toLowerCase() === queryParams) {
                setIsSearching(true);
                fetchPopularRepos(debouncedValue).then((results) => {
                    setRepos(results);
                    setIsSearching(false);
                });
            } else {
                setRepos([]);
                setIsSearching(false);
            }
        },
        [debouncedValue, queryParams] // Only call effect if debounced search term changes
    );

    const selectedLanguageHandler = (language) => {
        setSelectedLanguage(language)
    }

    return (<>
        <SelectedLanguages
            selectedLanguage={selectedLanguage}
            queryParams={queryParams}
            selectedLanguageHandler={selectedLanguageHandler}
            setRepos={setRepos}
            setSearchParams={setSearchParams}/>
        {isSearching ? <Loader/> : <Repos repos={repos}/>}
    </>);
}

export default Popular;
