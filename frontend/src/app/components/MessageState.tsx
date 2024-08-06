/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface MessageStateProps {
  messageState: string | null;
}

const MessageState: React.FC<MessageStateProps> = ({ messageState }) => {
  return (
    <React.Fragment>
      {messageState !== null && (
        <div className="py-2 px-1 flex">
          <img
            src={`/images/home/evva_chat.svg`}
            alt=""
            className="h-10 w-auto"
          />

          <div className="flex px-2 items-center">
            <div>
              <img
                src={`/images/home/message_states/${messageState}.svg`}
                alt=""
                className="h-4 w-auto"
              />
            </div>
            <div className="text-[#606F90] text-exsm p-2 px-2 rounded-3xl ">
              {messageState == 'drafting' && <div>Drafting response</div>}
              {messageState == 'framing' && <div>Framing Answer</div>}
              {messageState == 'researching' && <div>Researching</div>}
              {messageState == 'followup' && (
                <div>Framing follow-up questions</div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default MessageState;
