from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser   
from tools import web_search, scrape_url
import os 
from dotenv import load_dotenv
load_dotenv()   


llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.7
    ) 



def build_search_agent():
    return create_agent(
        model=llm,
        tools=[web_search],
    )

def recearch_agent():
    return create_agent(
        model=llm,
        tools=[scrape_url],
    )

writer_prompt = ChatPromptTemplate.from_messages(
    [
        ("system","you are an expert recearch writer .write clear ,structured and insightful reports."),
        ("human","""write a detailed recearch report on the topic below.
         
topic={topic}
recearch gathered
{research}
         
structure the report as :
         - introduction
         - key findings (minimum 3 well explained points)
         - conclusion
         - sources(list all Urls found in the research)

be detailed ,factual and professional"""
        )
    ]
)

writer_chain = writer_prompt | llm | StrOutputParser()


#critic chain
critic_prompt = ChatPromptTemplate.from_messages([
     ("system","you are a charp constructive research critic ne honest and specific in your feedback .  "),
     ("human","""Review the research report below and evaluate it strictly.
Report:
{report}
      
Respond in this exact format:

Score:X/10
      
Strengths:
      
-...

-...

Areas to Improve:
      
-...
-...
     
One line verdict:

...""" )      

])

critic_chain = critic_prompt | llm | StrOutputParser()


