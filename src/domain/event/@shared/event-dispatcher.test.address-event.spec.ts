import AddressChangedEvent from "../address/address-changed.event";
import EnviaConsoleLogHandler from "../address/handler/envia-console-log.handler";
import AddressCreatedEvent from "../customer/customer-created.event";
import EventDispatcher from "./event-dispatcher";

describe("event dispatcher 'Address Changed' unit test", () => {


  it("should register an address changed event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("AddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"].length
    ).toBe(1);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler);
  });


  it("should unregister an address changed event handler", () => {    
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("AddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"].length
    ).toBe(1);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("AddressChangedEvent", eventHandler);
    
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"].length
    ).toBe(0);
  });


  it("should unregister all events handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("AddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"].length
    ).toBe(1);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeUndefined();
  });


  it("should notify all address events handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"].length
    ).toBe(1);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const addressCreatedEvent = new AddressChangedEvent({
      id: "1",
      name: "John",
      address: "Rua Z"
    });
    
    eventDispatcher.notify(addressCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });


})