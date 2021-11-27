import React, { useEffect, useState }  from "react";
import LiAbout from './LiAbout';
import LiItems from './LiItems';
const List = ({li,getListsFromDb})=>{
   

    return (
        <>
            {li != null &&
                <>
                <LiAbout getListsFromDb= {getListsFromDb} li = {li}></LiAbout>
                <LiItems getListsFromDb= {getListsFromDb} li = {li} > </LiItems>
                </>
            }
        </>
    );
}

export {List};