import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<AddressChangedEvent> {

  handle(event: AddressChangedEvent): void {
    const eventData = event.eventData;
    console.log("Endereço do cliente: %s, %s alterado para: %s", eventData.id, eventData.name, eventData.address);
  }

}