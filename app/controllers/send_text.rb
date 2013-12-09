class SendTextController < ApplicationController
  def index
  end

  def send_text_message
    number_to_send_to = params[:phone_number]
    twilio_sid = 'bearly007'
    twilio_token = 'foobar'
    twilio_phone_number = '7742398699'

    @twilio_client = Twilio::REST::Client.new twilio_sid, twilio_token

    @twilio_client.account.sms.messages.create(
    :from => '+1+#{twilio_phone_number}',
    :to => number_to_send_to,
    :body => "Order #{order_id} is ready!  Pipping hot, ready to serve."
    )
  end
end

