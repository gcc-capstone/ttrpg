# TTRPG - Milestone 1

This is a document outlining what is expected and pledged to have been completed for the TTRPG computer science senior capstone by the deadline of milestone 1.

<br>

## Functionality

Outside of an active campaign session, users will be able to:

- Create a campaign session on a host device.

- Load a campaign session on a host device.

- Join an active campaign session on a client device.

<br>

While in an activate campaign session:

- Save the current active campaign session to the host device.

- Send content from a client device to the host device.

- Send content from the host device to an LLM.

- Recieve and display content from the LLM on the host device.

- Recieve and display content from the host device on the client device.

<br>

Content in the context of this project includes but is not limited to: player actions, dice results, queue information and requests, campaign settings and context, and plain text.

<br>

## Individual Responsibilities

### Joshua Burick

- Connection and communication between a host screen's device and client screens' devices will be available:

    - Content will be able to be sent from the host screen's device to client screens' devices.

    - Content will be able to be sent from client screens' devices to the host screen's device.

### Sheldon Deal

- Loading of an existing campaign will be available:

    - When provided with a valid file, a campaign will be initialized and filled with the existing data.

    - A summary of previous actions will be generated and displayed on the host screen upon loading of an existing campaign.

### JohnMichael Ross

- Creation and saving of a campaign will be available:

    - Initial data will be formatted and available for storage.

    - The campaign creation user interface will be streamlined.

    - Campaign settings, context, and other relevant information may be saved to a file.

### Henry Tan

- Communication between the host screen's device and a Large Language Model will be available:

    - Content will be able to be sent from the host screen's device to the LLM.

    - The LLM will be able to read the campaign's context available on the host screen's device.

    - The LLM's response content will be sent to the host screen's device and appear visually.