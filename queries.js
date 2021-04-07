exports.getUserList = `
#graphQL
query ($username: String) {
    MediaListCollection(userName: $username, type: ANIME) {
        lists {
        name
        status
        isCustomList
        entries {
            id
            progress
            status
            repeat
            notes
            customLists
            media{
            id
            type
            format
            status
            source
            season
            episodes
            startDate {
                year
                month
                day
            }
            endDate {
                year
                month
                day
            }
            title {
                romaji
                english
                native
            }
            }
        }
        }
    }
    }
`

exports.searchByName = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media (id: $id, search: $search, type: ANIME) {
            id
            type
            format
            status
            source
            season
            episodes
            title {
                romaji
                english
                native
            }
            synonyms
            startDate {
                year
                month
                day
            }
            endDate {
                year
                month
                day
            }
        }
    }
}
`

exports.saveCustomLists = `
mutation ($mediaId: Int, $customLists: [String]) {
    SaveMediaListEntry (mediaId: $mediaId, customLists: $customLists) {
      id
      customLists
    }
  }
`