class SMS

  def self.send_message(recipient, message)
    new(recipient, message).send
  end

  attr_reader :recipient, :message

  def initialize(recipient, message)
    #@recipient = recipient
    @recipient = "5204005693"
    @message = message
  end

  def sid
    "ACcbcc01e57687a227d75edf4874e76e08"
  end

  def token
    "f38445947e7bc841d5bc6b0e65cdc0a8"
  end

  def client
    @client ||= Twilio::REST::Client.new sid, token
  end

  def from
    "+15177217715"
  end

  def send
    client.account.sms.messages.create(
      :from => from,
      :to => recipient,
      :body => message
    )
  end

end
