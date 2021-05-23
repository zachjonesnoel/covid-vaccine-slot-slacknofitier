<template>
    <v-container>
        <v-card>
            <v-card-title>
              <span class="headline">{{ center.name }}</span>
            </v-card-title>
            <v-card-text>
                <!--{{center.sessions}}-->
                <div v-for="session in center.sessions" :key="session.session_id">
                    Date : {{session.date}}
                    <v-spacer></v-spacer>
                    Vaccine : {{session.vaccine}}
                    <v-spacer></v-spacer>
                    Min age : {{session.min_age_limit}}
                    <v-spacer></v-spacer>
                    <v-chip-group
                        active-class="primary--text"
                        column
                      >
                        <v-chip
                          v-for="tag in session.slots"
                          :key="tag"
                          @click="postMessageToSlack(tag, center, session)"
                        >
                          {{ tag }}
                        </v-chip>
                      </v-chip-group>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
    var axios = require('axios');

    export default {
        name: 'SessionsDialog',
        props: ['center'],
        methods: {
            async postMessageToSlack(slot, center, session) {
                try {
                    const SLACK_URL="https://lzbakmyx3e.execute-api.us-east-1.amazonaws.com/SLACK"
                    let messageText=`Covid Vaccine shot! \nVaccine center/address : ${center.name},${center.address},${center.district_name},${center.pincode}\nVaccine : ${session.vaccine}\n Date & time : ${session.date} ${slot}`
                    const response = await axios.post(SLACK_URL,{
                        text:messageText
                    });
                    console.log(response);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
</script>
