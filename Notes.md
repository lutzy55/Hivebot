# Hivebot Release v0.2
## New Features
* 👎 Has been added to allow reviewers to remove thmeselves from a reviewer list
* Once removed from the list, a reviewer can readd themselves with 👍
* Reacting with 👍 OR 👎 on *Hivemind Review Request Alerts* in **#hive-alerts** channel now acts as a toggle to perform the related action
* Reacting to *Hivemind Review Request Alerts* now DM's the Hivemind corrdinator


## Bug Fixes
* Reacting multiple times with 👍 will not add your name to reviewer list multiple times.
* Reacting to channel specific review alerts no longer adds users to that channel's `Reviewer Signup` field
* Channel specific review alerts no longer has the `Reviewer Signup` field which was not linked to the **#hive-alerts** channel *Hivemind Review Request Alerts* and caused confusion
* New releases of Hivebot will now monitor previous *Hivemind Review Request Alerts* messages and still action them as expected.

## Limitations
* *Hivemind Review Request Alerts* messages from the **#hive-alerts** channel and the review specfic channels are not linked
* Game specfic channels are still viewable by all Hivemind reviewers

## Known Errors
* Discord only allows for 50 pins in a channel at a time. When 51 is attempted, Hivebot will error out and quit. Error handling will be a part of a future update. Right now, Hivebot will work around this by automatically restarting, however it won't pin the last message or any messages going forward until the channel is under 50. Unfortunately, the only indication of this currently is the lack of message in the channel like "🐝🐝 pinned a message to this channel. See all the pins. — 03/26/2021".
# Deployment Configurations

## Enviromental Variables
HIVEMIND_PARENT_CATEGORY_ID
HIVEMIND_ALERTS_CHANNEL_ID
GOOGLE_LINK_BOT_TOKEN

## Notes
The Discord Bot token needs to be manually added to the last line of in the `client.login([TOKEN])` 