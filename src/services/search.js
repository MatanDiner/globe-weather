export function isEngliseLetter(str) {
    const reg = /^[ a-z, A-Z ]*$/;
    const res = reg.test(str);
    return res;
}

export function getFilteredSearchList(value,list,field){

if(value === "")return list;    
const filteredList = list.filter(item=>item[field].toLowerCase().includes(value.toLowerCase()));
return filteredList;

}