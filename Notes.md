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
