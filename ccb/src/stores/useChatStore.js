import {defineStore} from 'pinia'

export const useChatStore = defineStore('chat',{
    state:()=>({
        currentChatUser:null,
        messageLists:{}
    }),
    actions:{
        switchChatUser(user){
            this.currentChatUser = user
        },
        addMessage(userID,message){
            if(!this.messageLists[userID]){
                this.messageLists[userID] = []
            }
            this.messageLists[userID].push(message)
        },
        getMessage(userID){
            return this.messageLists[userID]
        }
    }
}
)