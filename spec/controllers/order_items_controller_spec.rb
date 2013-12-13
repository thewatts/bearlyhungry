require 'spec_helper'

describe OrderItemsController do

  describe "#create" do
    before do
      @order1 = FactoryGirl.create(:order)
      @order2 = FactoryGirl.create(:order)
    end

    context "order status defaults to pending" do
      it "adds an order item" do
        session[:order_id] = 1
        expect(@order1.order_items.count).to eq(0)

        post :create, order_item: {item_id: @item.id, quantity: 5}
        expect(@order1.order_items.count).to eq(1)
      end
    end
    
    context "an invalid order" do
      it "adds an order item" do
        session[:order_id] = 2
        expect(@order1.order_items.count).to eq(0)

        post :create, order_item: {item_id: @item.id, quantity: 5}
        expect(@order1.order_items.count).to eq(0)
      end
    end
  end

  describe "#destroy" do

    before do
      FactoryGirl.create(:item)
      @order1 = FactoryGirl.create(:order)
      @order2 = FactoryGirl.create(:order)
      @order_item1 = FactoryGirl.create(:order_item)
    end

    context "a valid order" do
      it "destroys an order item" do
        session[:order_id] = 1
        expect(OrderItem.count).to eq(1)
        expect(@order1.order_items.count).to eq(1)

        delete :destroy, id: @order_item1.id
        expect(OrderItem.count).to eq(0)
        expect(@order1.order_items.count).to eq(0)
        expect(session[:order_id]).to eq(1)
      end
    end

    context "for an invalid order" do
      it "cannot destroy an order item" do
        session[:order_id] = 2
        delete :destroy, id: @order_item1.id
        expect(@order1.order_items.count).to eq(1)
        expect(session[:order_id]).to eq(2)
      end
    end

  end

end
