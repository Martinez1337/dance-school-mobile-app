import {View} from 'react-native'
import {FlashList} from "@shopify/flash-list";
import React from 'react'

import SearchTag from "../components/SearchTag"

const SearchTagList = ({ searchTags, setSearchTags }) => {
    const updateProfileTagsState = (id, newValue) => {
        const updatedTagStates = searchTags.map(tag =>
            tag.id === id ? {...tag, value: newValue} : {...tag, value: false}
        );
        setSearchTags(updatedTagStates);
    };

    return (
        <View>
            {/*School profiles profileTags*/}
            <FlashList
                data={searchTags}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) =>
                    <SearchTag tag={item} updateTagsState={updateProfileTagsState}/>
                }
                estimatedItemSize={50}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 10}}
            />
        </View>
    )
}

export default SearchTagList;
