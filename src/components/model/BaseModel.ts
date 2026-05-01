/**
 * This is a helper type which defines an object with a specific constructor
 */
export type ModelConstructor<T extends BaseModel<T>> = new (data: Partial<T>) => T;

/**
 * This is a union type which describes a class which has the ModelConstrutor and the static methods defined on BaseModel
 *
 * This is used primarily by AppListConfig to enable this parameter to be passed in the constructor in each view and control
 * methods like createInstance
 */
export type ConcreteBaseModel<T extends BaseModel<T>> = ModelConstructor<T> &
  typeof BaseModel;

export abstract class BaseModel<T> {
  constructor(_data: Partial<T>) {
  }

  /**
   * Returns the display name for this class, this could be used in messages such as "Are you sure you want to delete displayName displayIdentifier?"
   *
   * Defaults to the name of the class and should be overridden as necessary
   */
  static displayName(): string {
    return this.name;
  }

  /**
   * Returns the field that uniquely identifies this object
   *
   * Defaults to 'id' as that's the most common but should be overridden if necessary (e.g. Media)
   */
  static primaryKey(): string {
    return "id";
  }

  /**
   * A static method on all BaseModel and sub-classes which converts the keys and values returned from the API to an instance of that class.
   *
   * Because we've standardized alll the APIs and model classes, this avoids having to write custom logic in each API component
   *
   * @param this BaseModel or a subclass
   * @param data record containing the keys and values we'd like to use
   * @returns an instance of T populated from the data
   */
  static fromApi<T extends BaseModel<T>>(
    this: new (data: any) => T,
    data: Record<string, any>,
  ): T {
    const camelData = Object.keys(data).reduce(
      (acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, char) =>
          char.toUpperCase(),
        );
        acc[camelKey] = data[key];
        return acc;
      },
      {} as Record<string, any>,
    );
    return new this(camelData);
  }

  /**
   * An instance method that converts the current BaseModel into a set of snake-cased key/value pairs suitable for calling one of the
   * API functions which takes this object as input (e.g. create, update).
   *
   * Will use the method inputKeys on the sub-class to determine which keys should be included
   *    *
   * @returns keys and values representing this object and limited to the properties in T
   */
  toApiInput(): Record<string, any> | number | string {
    const result: Record<string, any> = {};
    const properties = Object.getOwnPropertyNames(this).filter(
      (prop) => prop !== "constructor",
    );

    for (const prop of properties) {
      if (this.inputExcludedProperties().has(prop)) {
        continue;
      }
      const value = (this as any)[prop];
      const snakeKey = prop
        .toString()
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase();
      // Recursively call toApi if the value is itself a BaseModel
      if (value instanceof BaseModel) {
        result[snakeKey] = value.toApiInput();
      } else if (Array.isArray(value)) {
        result[snakeKey] = value.map((item) =>
          item instanceof BaseModel ? item.toApiInput() : item,
        );
      } else {
        result[snakeKey] = value;
      }
    }

    return result;
  }

  /**
   * Returns the set of properties on this object that should be excluded when converting to an API call which requires input (e.g. create, update)
   *
   * By default, the id property is excluded
   */
  inputExcludedProperties(): Set<string> {
    return new Set(["id"]);
  }

  /**
   * Returns the value to use when referring to this object.
   *
   * For example, this would be used to confirm deletion as in Are you sure you want to delete basemodel <displayIdentifier>
   *
   * This defaults to returning the value of the primaryKey property and should be overridden by subclasses if necessary
   *
   * @returns string
   */
  displayIdentifier(): string {
    return (
      String(
        this[(this.constructor as typeof BaseModel).primaryKey() as keyof this],
      ) || ""
    );
  }

  toString(): string {
    return JSON.stringify(this, null, 2);
  }

  toJSON(): object {
    return {
      ...this,
    };
  }
}
