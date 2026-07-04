from agent import build_search_agent,recearch_agent, writer_chain,critic_chain
from langchain_core.messages import HumanMessage
def run_recearch_pipeline(topic : str) ->dict:
     state = {}

     #search agent working
     print("\n"+"="*50)
     print("step 1 -search agent working...")
     print("="*50)
     
     search_agent=build_search_agent()
     search_result=search_agent.invoke(
          {
        "messages":[
            HumanMessage(
                content=f"find recent, reliable and detailed information about: {topic}"
                )
            ]
       }
     )
     state["search_result"]=search_result["messages"][-1].content

     #research agent working
     print("\n"+"="*50)
     print("step 2 -research agent working...")
     print("="*50)

     research_agent=recearch_agent()
     research_result=research_agent.invoke({
        "messages":[
            HumanMessage(
                content=f"Based on the following search results about: '{topic}',"
                         f"pick the most relevant URL and scrape it for deeper content/\n\n"
                         f"search results:\n{state['search_result'][:700]}"
            )
        ]
     })
     state["scraped_result"]=research_result["messages"][-1].content
     print("\nscraped content\n",state["scraped_result"])

     #writer agent working
     print("\n"+"="*50)
     print("step 3 -writer is drafting the report...")
     print("="*50)

     research_combied = (
          f"SEARCH RESULTS : \n{state['search_result'] }\n"
          f"SCRAPED CONTENT : \n{state['scraped_result']}"
     )

     state["report"] = writer_chain.invoke({
          "topic" : topic,
          "research" : research_combied
     }) 

     print("\n final report\n",state["report"])

    #critic report
    
     state["feedback"] = critic_chain.invoke({
       "report" : state['report']  
    })
    
     print("\n feedback on the report\n",state["feedback"])

     return state

if __name__=="__main__":
     topic = input("\n Enter the research topic: ")
     run_recearch_pipeline(topic)