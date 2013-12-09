class RecieveTextController > ActionController
  
  def index

    message_body = params["order_info"]
    from_number = parmas["restaurant"]

    SMSLogger.log_text_message from_number, message_body

  end
end
