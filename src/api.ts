import acClient from './activeCollabClient';
const md = require('markdown-it')();

export const PROJECT_ID: number=564;

export interface GitlabIssueTrigger {
    object_attributes: GitlabIssueAttributes
}

export interface GitlabIssueAttributes {
    action: string;
    title: string;
    description: string;
    url: string;
}


export async function handleGitlabWebhook(data: GitlabIssueTrigger): Promise<object>{
    const issueData=data.object_attributes;
    let response;
    if(issueData.action === 'update'){
        console.log("implement issue update");
    }
    else{
        response=await handleIssueCreated(issueData);
    }
    return {}
}

const descriptionWithRepoUrl=(description: string="", url: string="")=>{
    try {
        return `gitlab issue url: ${url} <br /><br /> ${md.render(description)}`;
    } catch (_e) {
        return `gitlab issue url: ${url} <br /><br /> ${description}`;
    }
} 


async function handleIssueCreated(data: GitlabIssueAttributes){
    const extendedDescription=descriptionWithRepoUrl(data.description, data.url);
    const createResponse=await acClient.post(`projects/${PROJECT_ID}/tasks`, {
        name: data.title,
        body: extendedDescription
    });
    return createResponse;

}


async function handleIssueUpdated(issueData: any){

}

async function handleIssueClosed(issueData: any){

}



/*
async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    try {
        const credentials = await this.getCredentials('activeCollabApi') as IDataObject;
        // Init Self-Hosted
        const activeCollabClient = new Client(
            credentials.username as string,
            credentials.password as string,
            credentials.client_name as string,
            credentials.client_vendor as string,
            undefined,
            credentials.url as string,
          );
        await activeCollabClient.issueToken();
        const returnData: IDataObject[] = [];


        const items = this.getInputData();
        returnData.push({'receivedItems': items});

        const projectId = this.getNodeParameter('projectId', 0) as string;

        

                    async function updateTask(taskId: number, data: object){
                        const updateResponse=await activeCollabClient.put(`projects/${projectId}/tasks/${taskId}`, data);
                        return returnData.push({
                                updatedTask: updateResponse.data
                        })
                    }

                    async function findTask(name: string){
                        // get projects tasks
                        const res=await activeCollabClient.get(`projects/${projectId}/tasks`);
                        const tasksData=res.data;

                        if(!tasksData) throw Error('could not load tasks data')

                        returnData.push({
                                tasksData
                        })

                        const tasks: any[]=tasksData.tasks;
                        if(!tasks) throw Error('could not load tasks')

                        const foundTask=tasks.find(task=>{
                                return task.name==name
                        });

                        return foundTask;
                    }


        const gitlabEvent: any=items[0];
        if(gitlabEvent){
            try {
                const object_attributes=gitlabEvent.json.body.object_attributes;

                if(object_attributes) {
                    const {title="", description="", url="", action}=object_attributes;
                    const parsedDescription = md.render(description);
                    console.log(parsedDescription);
                    const extendedDescription=descriptionWithRepoUrl(parsedDescription, url);

                    if(action==='update'){ // handle gitlab issue update
                        const changes=gitlabEvent.json.body.changes;
                        if(changes){
                            let prevTitle=title;
                            if(changes.title && changes.title.previous){
                                prevTitle=changes.title.previous;
                            }

                            const foundTask=await findTask(prevTitle);
                            if(foundTask){ // if task with the same name was found update it
                                const updatedProps: any={};
                                if(changes.title) updatedProps.name=title;
                                if(changes.description) updatedProps.body=extendedDescription

                                await updateTask(foundTask.id, updatedProps);
                            }else{ // create a new task
                                console.log("task does not exist yet, creating new");
                                                                    await createTask({
                                                                        name: title,
                                                                        body: extendedDescription
                                                                    })
                            }
                        }
                    }
                    else{
                                                await createTask({
                                                        name: title,
                                                        body: extendedDescription
                                                })

                    }
                };
            } catch (error) {
                console.log(error);
                throw Error('failed to create task from gitlab issue');
            }

        }

        // Map data to n8n data structure
        return [this.helpers.returnJsonArray(returnData)];
      } catch (error: any) {
        console.log(error);
        throw Error('failed to init Active Collab connection');

      }

      */