import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  
  it("should create a new order1", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    // ARRANGE
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order1 = new Order("123", customer.id, [orderItem]);

    // ACT
    await orderRepository.create(order1);

    const orderModel = await OrderModel.findOne({
      where: { id: order1.id },
      include: ["items"],
    });
    
    // ASSERT
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: customer.id,
      total: order1.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });


  it("should update an order1", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    // ARRANGE
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order1 = new Order("123", customer.id, [orderItem]);
    await orderRepository.create(order1);

    const customerFinal = new Customer("007", "James Bond");
    const addressFinal = new Address("Secret", 3, "Zipcode 9", "London");
    customerFinal.changeAddress(addressFinal);
    await customerRepository.create(customerFinal);
    const orderItemFinal = new OrderItem("1", product.name, product.price, product.id, 7);
    const orderFinal = new Order("123", customerFinal.id, [orderItemFinal]);

    // ACT
    await orderRepository.update(orderFinal);
    const orderModel = await OrderModel.findOne({ where: { id: "123" } });
    
    // ASSERT
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: customerFinal.id,
      total: orderFinal.total(),
    });
  });


  it("should find an order1", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    // ARRANGE
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order1 = new Order("123", customer.id, [orderItem]);

    // ACT
    await orderRepository.create(order1);
    const orderResult = await orderRepository.find("123");

    // ASSERT
    expect(orderResult).toStrictEqual(order1);
  });


  it("should findAll orders", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    // ARRANGE
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order1 = new Order("123", customer.id, [orderItem]);

    const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2);
    const order2 = new Order("456", customer.id, [orderItem2]);

    // ACT
    await orderRepository.create(order1);
    await orderRepository.create(order2);
    
    const orders = await orderRepository.findAll();

    // ASSERT
    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });

});
