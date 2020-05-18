import { BASE_URL } from "../../../utils/config";
import { Pixels } from "../Pixels";

export async function getPixels(): Promise<Pixels> {
  const data = await fetch(`${BASE_URL}/pixels`);

  return data.json();
}
