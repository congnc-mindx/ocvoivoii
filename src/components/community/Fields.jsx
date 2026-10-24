export default function Fields({ fields, values, errors, onChange }) {
  return fields.map((item) => {
    const id = `community-${item.name}`;

    const shared = {
      id,
      name: item.name,
      required: item.required,
      "aria-invalid": Boolean(errors[item.name]),
      "aria-describedby": `${id}-hint ${id}-error`,
    };

    return (
      <div key={item.name}>
        <label
          htmlFor={item.type === "multi" ? undefined : id}
          className="field-label"
        >
          {item.label}{" "}
          {item.required && <span className="text-rose-300">*</span>}
        </label>

        {item.type === "multi" ? (
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">{item.label}</legend>

            {item.options.map((choice) => (
              <label
                key={choice.value}
                className="flex items-center gap-3 rounded-xl border border-white/10 p-3 text-sm"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  value={choice.value}
                  checked={(values[item.name] ?? []).includes(choice.value)}
                  onChange={(event) =>
                    onChange(
                      item.name,
                      event.target.checked
                        ? [...(values[item.name] ?? []), choice.value]
                        : (values[item.name] ?? []).filter(
                            (value) => value !== choice.value,
                          ),
                    )
                  }
                  className="accent-cyan-400"
                />
                {choice.label}
              </label>
            ))}
          </fieldset>
        ) : item.type === "checkbox" ? (
          <input
            {...shared}
            type="checkbox"
            checked={values[item.name] === true}
            onChange={(event) => onChange(item.name, event.target.checked)}
            className="h-5 w-5 accent-cyan-400"
          />
        ) : item.type === "select" ? (
          <select
            {...shared}
            value={values[item.name] ?? ""}
            onChange={(event) => onChange(item.name, event.target.value)}
            className="field-input bg-slate-900"
          >
            <option value="">Chọn một lựa chọn</option>

            {item.options.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        ) : item.type === "textarea" ? (
          <textarea
            {...shared}
            rows={4}
            maxLength={item.maxLength}
            value={values[item.name] ?? ""}
            onChange={(event) => onChange(item.name, event.target.value)}
            className="field-input"
          />
        ) : (
          <input
            {...shared}
            type={item.type}
            maxLength={item.maxLength}
            value={values[item.name] ?? ""}
            onChange={(event) => onChange(item.name, event.target.value)}
            className="field-input"
          />
        )}

        <p id={`${id}-hint`} className="mt-2 text-xs leading-6 text-slate-400">
          {item.hint}
        </p>

        <p id={`${id}-error`} className="mt-1 text-sm text-rose-300">
          {errors[item.name]}
        </p>
      </div>
    );
  });
}
